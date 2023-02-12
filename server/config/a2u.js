
import pi_backend_1 from "pi-backend";
import dotenv_1 from "dotenv";
dotenv_1.config();
const apiKey = process.env.PI_API_KEY || "pqacyo0vwvkcgnhbk9i4ctqnnt5h9t95ddsgnbjzpzfl3gsb5feph6wgytscoasv";
const walletPrivateSeed = process.env.WALLET_PRIVATE_SEED || "SBNNSRXAFSHZGVFSBTLAATOCIOTSEIE3CLC4GRGGXLRWLIS6B4YKCMMW";
const pi = new pi_backend_1["default"](apiKey, walletPrivateSeed);
export async function createWithdraw(payment) {
  try {
    const paymentData=payment;
    const tt= await pi.createPayment(paymentData)
    return tt;
  }
    catch(err) {
      console.log("Lỗi 1: ", err); 
    
    }
}
export async function createTxid(hiiu) {
  try {
    const paymentId=hiiu;
    const txid = await pi.submitPayment(paymentId);
    return txid;
  }
    catch(err) {
      console.log("Lỗi 2: ", err); 
    }
}
export async function completeWithdraw(lanh,hehe) {
  try {
    const paymentId=lanh;
    const txid = hehe;
    const completedPayment = await pi.completePayment(paymentId, txid);
    return completedPayment;
  }
    catch(err) {
      console.log("Lỗi 3: ", err); 
    }
}
export async function incompleteWithdraw() {
  try {
    const incompleteWithdraw = await pi.getIncompleteServerPayments();
    return incompleteWithdraw;
  }
  catch(err) {
    console.log("Lỗi 4: ", err); 
  }
}
export async function cancelWithdraw(paymentID) {
  try {
    const paymentId = paymentID;
    const cancelWithdraw = await pi.cancelPayment(paymentId)
    return cancelWithdraw;
  }
  catch(err) {
    console.log("Lỗi 5: ", err); 
  }
}

