import { getProducts } from "@/shared/services/api/productsApi";

import { useQuery } from "@tanstack/react-query";

// interface Props {
//     page: number;
//     pageSize: number;
// }

// export function useProducts({ page, pageSize }: Props) {
//     return useQuery({
//         queryKey: ["products", page],
//         queryFn: () =>
//             getProducts({
//                 offset: page * pageSize,
//                 limit: pageSize,
//                 include_only_active: false,
//             }),
//     });
// }

interface Props{
  page: number;
  pageSize: number;
}

export function useProductsAvailable({page, pageSize}: Props) {
  return useQuery({
    queryKey: ["products", page],
    queryFn: () => 
      getProducts({
        offset: page * pageSize,
        limit: pageSize,
        include_only_active: true
      })
  })
}