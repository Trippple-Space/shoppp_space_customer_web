import axios from 'axios';

export type FetchErrorKind = 'network' | 'server' | 'unknown';

export function classifyFetchError(error: unknown): FetchErrorKind {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'network';
    }
    if (!error.response) {
      return 'network';
    }
    return 'server';
  }

  if (error instanceof TypeError) {
    const m = error.message.toLowerCase();
    if (m.includes('fetch') || m.includes('network')) {
      return 'network';
    }
  }

  const msg =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : '';

  if (/network|failed to fetch|econnrefused|etimedout|load failed/i.test(msg)) {
    return 'network';
  }

  return 'unknown';
}

export function getProductFetchErrorCopy(kind: FetchErrorKind): {
  title: string;
  description: string;
} {
  if (kind === 'network') {
    return {
      title: 'Connection problem',
      description:
        'We could not reach our servers. Check your internet connection and try again.',
    };
  }
  if (kind === 'server') {
    return {
      title: 'Something went wrong',
      description: 'The server had trouble completing this request. Please try again in a moment.',
    };
  }
  return {
    title: 'Could not load products',
    description: 'Something unexpected happened. Please try again.',
  };
}

export function getStoreFetchErrorCopy(kind: FetchErrorKind): {
  title: string;
  description: string;
} {
  if (kind === 'network') {
    return {
      title: 'Could not load this store',
      description:
        'Your connection was interrupted or the server is unreachable. Check your network and try again.',
    };
  }
  if (kind === 'server') {
    return {
      title: 'Store temporarily unavailable',
      description: 'We could not load this storefront right now. Please try again shortly.',
    };
  }
  return {
    title: 'Could not load this store',
    description: 'Something went wrong while loading this page. Try refreshing.',
  };
}

export function getProductDetailsErrorCopy(kind: FetchErrorKind): {
  title: string;
  description: string;
} {
  if (kind === 'network') {
    return {
      title: 'Connection problem',
      description:
        'We could not load this product. Check your internet connection and try again.',
    };
  }
  if (kind === 'server') {
    return {
      title: 'Something went wrong',
      description: 'We could not load this product right now. Please try again in a moment.',
    };
  }
  return {
    title: 'Could not load product',
    description: 'This product could not be loaded. You can go back or try again.',
  };
}

export function toDisplayError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Request failed');
}
