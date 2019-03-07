import { DeclarationHandler } from "../../core/refs/ModuleRef";
import { Type } from "../../common";
import { ControllerMetadata } from "../metadata/ControllerMetadata";
import { DeclarationMetadata } from "../../core/metadata/DeclarationMetadata";

export class ControllerHandler extends DeclarationHandler<ControllerMetadata> {
    isSupported(declaration: DeclarationMetadata) {
        return declaration instanceof ControllerMetadata;
    }

    async handle(declaration: ControllerMetadata) {
        console.log(`Handling ${declaration.type.name}`);
    }
}