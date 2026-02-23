import {
  useRouter as useNextRouter,
  usePathname as useNextPathname,
  useSearchParams as useNextSearchParams,
  useParams as useNextParams
} from "next/navigation";
import { useCallback } from 'react';

let lastNavigationState: any = null;

export function useRouter(): any {
  const router = useNextRouter();

  const push = useCallback((href: string, options?: any) => {
    if (options && options.state) {
      lastNavigationState = options.state;
    } else {
      lastNavigationState = null;
    }
    router.push(href, options);
  }, [router]);

  const replace = useCallback((href: string, options?: any) => {
    if (options && options.state) {
      lastNavigationState = options.state;
    } else {
      lastNavigationState = null;
    }
    router.replace(href, options);
  }, [router]);

  return {
    ...router,
    push,
    replace,
  };
}

export function useLocation() {
  const pathname = useNextPathname();
  const searchParams = useNextSearchParams();

  return {
    pathname,
    search: searchParams ? searchParams.toString() : '',
    state: lastNavigationState,
    key: '',
    hash: '',
  };
}

export function usePathname(): any {
  return useNextPathname();
}

export function useSearchParams(): any {
  return useNextSearchParams();
}

export function useParams(): any {
  return useNextParams();
}
