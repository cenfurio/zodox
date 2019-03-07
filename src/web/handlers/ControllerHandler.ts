import { DeclarationHandler } from "../../core/refs/ModuleRef";
import { Type } from "../../common";
import { ControllerMetadata } from "../metadata/ControllerMetadata";
import { TypeMetadata } from "../../core/metadata";

export class ControllerHandler extends DeclarationHandler<ControllerMetadata> {
    isSupported(declaration: TypeMetadata) {
        return declaration instanceof ControllerMetadata;
    }

    async handle(declaration: ControllerMetadata) {
        console.log(`Handling ${declaration.type.name}`);
    }
}