interface CoworkingItem {
  _id: string,
  name: string,
  address: string,
  district: string,
  province: string,
  postalcode: string,
  tel: string,
  picture: string,
  time: string,
  __v: number,
  id: string
}

interface CoworkingJson {
  success: boolean,
  count: number,
  pagination: Object,
  data: CoworkingItem[]
}

interface BookingItem {
  nameLastname: string;
  tel: string;
  coWorking: string;
  bookDate: string;
}

interface User{
  _id: string;
  name: string;
  email: string;
  tel: string;
  password: string;
  role: string;
  createdAt: string;
}

interface BannedUser {
  reason: string;
  unbanDate: string;
  user : User;
  __v : string;
  _id : string;
}

interface RatingItem {
  _id : string,
  CoWorkingId: string,
  UserId: {
    _id: string,
    name: string,
    email: string,
  }
  rating: number,
  comment: string,
  createdAt: string,
}
