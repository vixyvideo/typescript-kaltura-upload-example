import {KalturaBrowserHttpClient} from "kaltura-typescript-client";
import {UploadTokenUploadAction} from "kaltura-typescript-client/types/UploadTokenUploadAction";
import {SessionStartAction} from "kaltura-typescript-client/types/SessionStartAction";
import {KalturaSessionType} from "kaltura-typescript-client/types/KalturaSessionType";
import {UploadTokenAddAction} from "kaltura-typescript-client/types/UploadTokenAddAction";

window.onload = () => {
    UploadWrapper.init();
}
//
// const kaltura = import('kaltura-client');

class UploadWrapper{
    private secret: string;
    private partnerId: number;

    constructor(private secretInput: HTMLInputElement, private partnerIdInput: HTMLInputElement, private fileElement: HTMLInputElement) {
        secretInput.addEventListener('change', proxy(this.changeKs,this) );
        this.secret = secretInput.value;
        partnerIdInput.addEventListener('change', proxy(this.changePartnerId,this) );
        this.partnerId = parseInt( partnerIdInput.value );
        fileElement.addEventListener('change', proxy(this.upload,this) );
    }

    public changeKs(element, event){
        this.secret = event.target.value;
    }

    public changePartnerId(element, event){
        this.partnerId = event.target.value;
    }

    public async upload(element, event){
        let file = event.target.files[0];

        try {

            const client = new KalturaBrowserHttpClient({
                endpointUrl: "https://platform.vixyvideo.com",
                clientTag: "lorem_ipsum"
            });

            client.ks = await client.request(new SessionStartAction({
                secret: this.secret,
                type: KalturaSessionType.user,
                partnerId: this.partnerId,
                expiry: 500
            }));

            let tokenResponse = await client.request(new UploadTokenAddAction({

            }));

            let upload = await client.request(new UploadTokenUploadAction({
                uploadTokenId: tokenResponse.id,
                fileData: file
            }));

            alert('done done');
            return;
        }catch (e) {
            alert(e.message);
            return;
        }
        return;
    }


    public static init(){
        let secretElement = document.querySelector('input[name=secret]');
        let partnerIdElement = document.querySelector('input[name=partnerId]');
        let fileElement = document.querySelector('input[name=file]');

        new UploadWrapper(secretElement,partnerIdElement, fileElement);
    }
}

function proxy(method: Function, instance: Object){
    return (...args: any[]) => {
        method.apply(instance, [this].concat(args));
    }
}