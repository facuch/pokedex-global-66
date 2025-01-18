export default interface Paginate {
  count: number
  next: string | null
  previous: string | null
  limit: number
  offset: number
}
