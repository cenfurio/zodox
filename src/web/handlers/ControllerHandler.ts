import { DeclarationHandler } from "../../core/refs/ModuleRef";
import { Type } from "../../common";
import { ControllerMetadata } from "../metadata/ControllerMetadata";

export class ControllerHandler extends DeclarationHandler<ControllerMetadata> {
    isSupported(declaration: ControllerMetadata) {
        return declaration instanceof ControllerMetadata;
    }

    async handle(declaration: ControllerMetadata) {
        console.log(`Handling ${declaration.type.name}`);
    }
}