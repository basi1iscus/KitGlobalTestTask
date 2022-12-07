export default function checkResponce(responce: any) {
  if (!responce.success) {
    return 500
  }
  return 200
}
