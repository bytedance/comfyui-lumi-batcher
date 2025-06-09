/** 接口返回约定 */
declare interface ApiResWrap<T> {
  code: number;
  data: T;
  message: string;
  request_id: string;
}
