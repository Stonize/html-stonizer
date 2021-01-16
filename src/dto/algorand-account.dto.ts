import { ObjectDto } from "./object.dto";

export class AlgorandAccountDto extends ObjectDto {

    constructor(object: any) {
        super();
        this.getField(object, "mnemonic");
        this.getField(object, "account");
    }

    readonly mnemonic: string;

    readonly account: { addr: string, sk: string };

} 