/* eslint-disable no-unused-vars */
import { useContext, createContext } from "react";

export const BillContext = createContext({
    bills : [ { id : 1, title : 'Money', name : 'Someone', fullPrice : 123, paidPrice : 123 } ],
    addBill : (bill) => {},
    removeBill : (id) => {},
    editBill : (id) => {},
    addPaidAmount : (amount) => {},
    billFormVisibilityChanger : (boolean) => {}
})

export const BillContextProvider = BillContext.Provider

export const useBillContext = () => useContext(BillContext)