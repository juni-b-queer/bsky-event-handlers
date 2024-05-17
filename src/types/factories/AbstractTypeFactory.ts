export abstract class AbstractTypeFactory {
    constructor() {}

    static factory() {
        throw new Error('Method Not Implemented! Use constructor.');
    }

    static make(){
        throw new Error('Method Not Implemented! Use constructor.');
    }

    create() {
        throw new Error('Method Not Implemented! Use constructor.');
    }


}

export class TestFactory extends AbstractTypeFactory {}
