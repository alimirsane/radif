import { ColorTypes } from "@kit/common/color-type"
export type statusTypes = 
    | "active"
    | "inactive"
    | "pending"
    | "rejected" 
    | "done"
    | "canceled"
    | "new"
    | "awaitingSamples"
    | "awaitingPayment"
    | undefined

export interface TabListType {
    color : ColorTypes
    status : statusTypes
    text : string
    count : string
}

export interface RequestListType {
    color : ColorTypes
    date : string
    id : number
    name : string
    status : statusTypes
    statusText : string
    trackingCode : string
}

export interface CustomerProfileUserType {
    fullname : string
    phone : string
    email : string
}

export interface CustomerProfileTestType {
    name : string
    track : string
}

export interface CustomerProfileSamplesType {
    name : string
    id : number
}


export interface CustomerProfileRequestParamatersType {
    name : string
    title : string
}

export interface CustomerProfileAttachmentsType {
    articles : {
        id : number 
        image : string
    }[]
    sample_images : string[]
}

export interface CustomerProfileType {
    id : number 
    user : CustomerProfileUserType
    test : CustomerProfileTestType
    samples : CustomerProfileSamplesType
    request_paramaters : CustomerProfileRequestParamatersType[]
    attachments : CustomerProfileAttachmentsType
}

export interface SampleDataType {
    name : string
    structure : string
    material : string
    type : string
    maintenance : string
    url : string
    barcode : string
}