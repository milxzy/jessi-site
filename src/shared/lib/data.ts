import { commerce } from '../commerce'
import { getEntry, getPage, listEntries } from '../content'
import { useAsync } from './useAsync'

// thin hooks over the commerce and content layers
export const useProducts = () => useAsync(() => commerce.listProducts(), [])
export const useProduct = (handle: string) => useAsync(() => commerce.getProduct(handle), [handle])
export const useCollections = () => useAsync(() => commerce.getCollections(), [])
export const useCollectionProducts = (handle: string) => useAsync(() => commerce.getCollectionProducts(handle), [handle])
export const useJournal = () => useAsync(() => listEntries(), [])
export const useEntry = (handle: string) => useAsync(() => getEntry(handle), [handle])
export const usePage = (handle: string) => useAsync(() => getPage(handle), [handle])
