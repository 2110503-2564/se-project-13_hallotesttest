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
  
  interface BannedUser {
    _id: string;
    user: string;
    reason: string;
    unbanDate: string;
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