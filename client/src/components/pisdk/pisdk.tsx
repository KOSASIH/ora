import axios from 'axios';

export type User = AuthResult['user'];
type AuthResult = {
  accessToken: string,
  user: {
    uid: string,
    username: string
  }
};
type PaymentDTO = {
  // Payment data:
  identifier: string, // payment identifier
  user_uid: string, // user's app-specific ID
  amount: number, // payment amount
  memo: string, // a string provided by the developer, shown to the user
  metadata: Object, // an object provided by the developer for their own usage
  from_address: string, // sender address of the blockchain transaction
  to_address: string, // recipient address of the blockchain transaction
  direction: Direction, // direction of the payment
  created_at: string, // payment's creation timestamp
  network: AppNetwork, // a network of the payment
  
  // Status flags representing the current state of this payment
  status: {
    developer_approved: boolean, // Server-Side Approval
    transaction_verified: boolean, // blockchain transaction verified
    developer_completed: boolean, // server-Side Completion
    cancelled: boolean, // cancelled by the developer or by Pi Network
    user_cancelled: boolean, // cancelled by the user
  },
  
  // Blockchain transaction data:
  transaction: null | { // This is null if no transaction has been made yet
    txid: string, // id of the blockchain transaction
    verified: boolean, // true if the transaction matches the payment, false otherwise
    _link: string, // a link to the operation on the Blockchain API
  },
}
type MyPaymentMetadata = {};
type Direction = "user_to_app" | "app_to_user"
type AppNetwork = "Pi Network" | "Pi Testnet"
// type Scope = "username" | "payments" | "wallet_address"
const config = {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}};
declare global {
  interface Window {
      Pi:any;
  }
}


//AUTH SIGNUP
export async function Pisdk() {
  try {
    const scopes = ['username', 'payments'];
  let authResult: AuthResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
 return authResult.user;
  } catch(err) {
    alert(err);
  }
}

const onIncompletePaymentFound = (payment: PaymentDTO) => {
  console.log("Giao dịch không hoàn thành", payment);
  return axios.post('/payments/incomplete', {payment});
}

//Create Pi Donate
export async function donatePi (memo: string, amount: number, paymentMetadata: MyPaymentMetadata) {
const paymentData = { amount, memo, metadata: paymentMetadata };
const onIncompletePaymentFound = (payment: PaymentDTO) => {
  console.log("Giao dịch không hoàn thành", payment);
  return axios.post('/payments/incomplete', {payment});
}

const onReadyForApproval = async (paymentId) => {
  console.log("Đợi xác nhận giao dịch", paymentId);
  axios.post('/payments/approve', {paymentId}, config);
};

const onReadyForCompletion = (paymentId, txid) => {
 
  console.log("Đợi hoàn thành giao dịch", paymentId, txid);
  axios.post('/payments/complete', {paymentId, txid}, config);
};




const onCancel = (paymentId: string) => {
  console.log("Đã hủy giao dịch", paymentId);
  return axios.post('/payments/cancelled_payment', {paymentId});
}
const onError = (error: Error) => {
  console.log("Lỗi ", error);
}

const ddd = async config => {
  window.Pi.createPayment(config, {
    // Callbacks you need to implement - read more about those in the detailed docs linked below:
    onReadyForServerApproval: paymentId =>
      onReadyForApproval(paymentId),
    onReadyForServerCompletion: (paymentId, txid) =>
      onReadyForCompletion(paymentId, txid),
    onCancel: onCancel,
    onError: onError,
  });
}

let piUser: any;
const authenticatePiUser = async () => {
  const scopes = ["username", "payments"];
  try {
    let user = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    return user;
  } catch (err) {
    console.log(err);
  }
};




   
      try {
      piUser = await authenticatePiUser();
      if(piUser) ddd(paymentData);
     
      } catch (err) {
        console.log("Lỗi: " + JSON.stringify(err));
      }
    } 
   
