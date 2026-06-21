import { getApiBase } from "../api/config";

export type KitchenEventType =
    | "NUEVO_PEDIDO"
    | "PEDIDO_CONFIRMADO"
    | "PEDIDO_EN_PREPARACION"
    | "PEDIDO_EN_CAMINO"
    | "PEDIDO_CANCELADO"
    | "ESTADO_ACTUALIZADO";

export type KitchenEventHandler<T = unknown> = (data: T) => void;

export interface KitchenSocketMessage<T = unknown> {
    event: KitchenEventType;
    data: T;
}

interface KitchenSocketListener {
    handler: KitchenEventHandler;
}

const KITCHEN_ROOM = "role:KDS";
const RECONNECT_DELAY_MS = 5000;

export class KitchenSocket {
    private static instance: KitchenSocket | null = null;

    private socket: WebSocket | null = null;
    private listeners: Map<KitchenEventType, Set<KitchenSocketListener>> = new Map();
    private roomRefCount = 0;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private isManualClose = false;

    private constructor() {}

    static getInstance(): KitchenSocket {
        if (!KitchenSocket.instance) {
            KitchenSocket.instance = new KitchenSocket();
        }
        return KitchenSocket.instance;
    }

    joinRoom(): void {
        this.roomRefCount += 1;
        if (this.roomRefCount === 1) {
            this.connect();
        }
    }

    leaveRoom(): void {
        this.roomRefCount = Math.max(0, this.roomRefCount - 1);
        if (this.roomRefCount === 0) {
            this.disconnect();
        }
    }

    on<T = unknown>(event: KitchenEventType, handler: KitchenEventHandler<T>): () => void {
        const listener: KitchenSocketListener = { handler: handler as KitchenEventHandler };
        let bucket = this.listeners.get(event);
        if (!bucket) {
            bucket = new Set();
            this.listeners.set(event, bucket);
        }
        bucket.add(listener);

        return () => {
            const current = this.listeners.get(event);
            if (!current) return;
            current.delete(listener);
            if (current.size === 0) {
                this.listeners.delete(event);
            }
        };
    }

    disconnect(): void {
        this.isManualClose = true;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    private connect(): void {
        if (
            this.socket &&
            (this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }

        this.isManualClose = false;

        const base = getApiBase();
        const wsProtocol = base.startsWith("https") ? "wss:" : "ws:";
        const host = base.replace(/^https?:\/\//, "");
        const url = `${wsProtocol}//${host}/api/v1/pedidos/cocina/ws`;

        const socket = new WebSocket(url);
        this.socket = socket;

        socket.onopen = () => {
            // El backend suscribe este socket a la room role:KDS tras validar la cookie.
        };

        socket.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data) as KitchenSocketMessage;
                this.dispatch(msg);
            } catch (err) {
                console.error("[KitchenSocket] error parseando mensaje:", err);
            }
        };

        socket.onerror = () => {
            // Silenciamos el error para evitar spam en consola.
            // El onclose se encarga de la reconexión.
        };

        socket.onclose = (event) => {
            this.socket = null;
            if (!this.isManualClose && this.roomRefCount > 0) {
                // No reconectar si el servidor cerró activamente (código 1008, 1011, etc.)
                if (event.code >= 1000 && event.code < 4000) {
                    this.reconnectTimer = setTimeout(() => this.connect(), RECONNECT_DELAY_MS);
                }
            }
        };
    }

    private dispatch(msg: KitchenSocketMessage): void {
        const bucket = this.listeners.get(msg.event);
        if (!bucket) return;
        for (const listener of bucket) {
            try {
                listener.handler(msg.data);
            } catch (err) {
                console.error(`[KitchenSocket] error en listener de ${msg.event}:`, err);
            }
        }
    }
}

export const KITCHEN_WS_ROOM = KITCHEN_ROOM;
