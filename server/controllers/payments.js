import platformAPIClient from "../config/platformAPIClient.js";
import { paymentModel } from "../models/paymentModel.js";
import { UserModel } from "../models/UserModel.js";
import { withdrawModel } from "../models/a2uModel.js";
import {createWithdraw,createTxid,completeWithdraw,incompleteWithdraw,cancelWithdraw} from "../config/a2u.js"

export default function mountPaymentsEndpoints(router) {
  // handle the incomplete payment
  router.post('/incomplete', async (req, res) => {
    const payment = req.body.payment;
    const paymentId = payment.identifier;
    const txid = payment.transaction && payment.transaction.txid;
    const txURL = payment.transaction && payment.transaction._link;

    try {
      await platformAPIClient.post(`/v2/payments/${paymentId}/complete`, { txid });
      return res.status(200).json({ message: `Giao dich thanh cong ${paymentId}` });
    } 
    catch (err) {
      res.status(500).json({
        error: err,
    });
    }
   
  });

  // approve the current payment
  router.post('/approve', async (req, res) => {
  const paymentId = req.body.paymentId;
  const userPi = req.body.paymentData.memo.slice(3);
  console.log(userPi);
 const currentPayment = await platformAPIClient.get(`/v2/payments/${paymentId}`);
    const creatPayment = await paymentModel.create({
      user: userPi,
      balance: + 1,   
      paymentId: paymentId, 
      txid: "",
      paid: false,
      cancelled: false,
    })
    

      res.status(200).json({
          status: 'OK',
          data:{
            creatPayment
          }
      })
  
    // let Pi Servers know that you're ready
    await platformAPIClient.post(`/v2/payments/${paymentId}/approve`);
  
  });

  // complete the current payment
  router.post('/complete', async (req, res) => {
    const userPi = req.body.paymentData.memo.slice(3);
    console.log(userPi);
    const paymentId = req.body.paymentId;
    const txid = req.body.txid;
    const completePayment = await paymentModel.findOneAndUpdate({ paymentId: paymentId },  { txid: txid, paid: true  })
    const Balance = await UserModel.findOne({userName: userPi});
     if (Balance) await UserModel.findOneAndUpdate({ userName: userPi },  { mobile: Balance.mobile + 0.99 })
    const ref = await UserModel.findOne({userName: userPi},{identification:1});
    if (ref) {
      console.log("Ref of ",ref.identification);
      const BalanceRef = await UserModel.findOne({ userName: ref.identification });
      if(BalanceRef) await UserModel.findOneAndUpdate({ userName: ref.identification},  { mobile: BalanceRef.mobile + 0.01 })
    }
   
    // let Pi server know that the payment is completed
    await platformAPIClient.post(`/v2/payments/${paymentId}/complete`, { txid });
    return res.status(200).json({ message: `Hoàn thành giao dịch ${paymentId}` });
  });

  // handle the cancelled payment
  router.post('/cancelled_payment', async (req, res) => {
const paymentId = req.body.paymentId;

const cancelledPayment = await paymentModel.findOneAndUpdate({ paymentId: paymentId },  { cancelled: true })
   
    return res.status(200).json({ message: `Hủy giao dịch ${paymentId}` });
  })

  router.post('/withdraw', async (req, res) => {
    const userUid = await req.body.piId
    const amount = await req.body.amount
    const piName = await req.body.Piname
    
    const paymentData = 
    {
      amount: amount,
      memo: "WithDraw", 
     metadata: {withdraw: "Piora"},
       uid: userUid }
       console.log("lol",paymentData);
    try {
      console.log(paymentData);
      const creatWithdrawModel = await withdrawModel.create({
       uid: userUid,
       piName: piName,
        balance: amount,
        memo: "WithDraw", 
       metadata: {withdraw: "Piora"},
         })
      const paymentId = await createWithdraw(paymentData);
    if (paymentId) {
      console.log("paymentId",paymentId)
      const checkDouble = await withdrawModel.find({paymentId: paymentId});
      if (checkDouble.length!==0)  return res.status(400).json({ message: "Double pay" })
      else {
        const updatepaymentId = await withdrawModel.findOneAndUpdate({  _id: creatWithdrawModel._id },  { paymentId: paymentId })
        console.log(updatepaymentId);
       const txId = await createTxid(paymentId);
               if(txId) { console.log("txid",txId)
                          const updatepaymentTxid = await withdrawModel.findOneAndUpdate({ _id: creatWithdrawModel._id },  { txid:txId })
                         const completeW = await completeWithdraw(paymentId,txId)
                         
                         const UpdateBalance = await UserModel.findOneAndUpdate({ mail: piName },  { mobile: 0})
                         console.log("Done",updatepaymentTxid,"status",completeW, "balance", UpdateBalance)
                         return res.status(200).json({
                           message: `Đã tạo giao dịch ${completeW}`,
                           txid: txId
                   })
 }
      }
    
   
 } 
 else {
const getIncompleteWithdraw = await incompleteWithdraw();
if (getIncompleteWithdraw) {
  console.log("IncompleteWithdraw",getIncompleteWithdraw.incomplete_server_payments[0].identifier);
  const calceledWithdraw =  await cancelWithdraw(getIncompleteWithdraw.incomplete_server_payments[0].identifier);
  console.log("huy giao dich",calceledWithdraw);
}
 }
 }
    catch (err) {
      res.status(500).json({
        error: err,
    });
    }
   
  });
}
