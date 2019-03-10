import { DeclarationHandler, TypeMetadata } from "@zodox/core";
import { ControllerMetadata } from "../metadata/ControllerMetadata";

export class ControllerHandler extends DeclarationHandler<ControllerMetadata> {
    isSupported(declaration: TypeMetadata) {
        return declaration instanceof ControllerMetadata;
    }

    async handle(declaration: ControllerMetadata) {
        console.log(`Handling ${declaration.type.name}`);
    }
}