import { Type } from "../lang";

export enum AnnotationDescriptor {
    MODULE, CONTROLLER
}

function descriptorToType(descriptor: AnnotationDescriptor) {
    switch(descriptor) {
        case AnnotationDescriptor.MODULE:
            return "module";
        case AnnotationDescriptor.CONTROLLER:
            return "controller";
    }
}

function descriptorToAnnotation(descriptor: AnnotationDescriptor) {
    switch(descriptor) {
        case AnnotationDescriptor.MODULE:
            return "@Module";
        case AnnotationDescriptor.CONTROLLER:
            return "@Controller";
    }
}

export class NoAnnotationError extends Error {
    constructor(type: Type<any>, descriptor: AnnotationDescriptor) {
        super(`Unexpected ${descriptorToType(descriptor)} '${type.name}'. Please add a ${descriptorToAnnotation(descriptor)} annotation.`);
    }
}