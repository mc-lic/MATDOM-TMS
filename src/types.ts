export interface TransportOrder {
  id: string;
  clientName: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupDate: string;
  deliveryDate: string;
  cargoType: string;
  cargoWeight: number;
  vehicleType: string;
  status: "Oczekujące" | "W realizacji" | "Zakończone";
  vehicleId?: string;
  driverId?: string;
  branchId?: string;
  distance?: number; // Nowe pole: odległość w km
}

export interface Vehicle {
  id: string;
  registration: string;
  type: string;
  capacity: number;
  status: "Dostępny" | "W użyciu" | "W naprawie";
}

export interface Driver {
  id: string;
  fullName: string;
  phoneNumber: string;
  status: "Dostępny" | "W trasie" | "Na urlopie";
}

export interface Branch {
  id: string;
  name: string;
  address: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: "admin" | "user";
  branchId?: string;
}