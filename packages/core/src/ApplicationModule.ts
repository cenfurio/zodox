import { Module } from "./annotations";
import { ApplicationInitializer } from "./ApplicationInitializer";
import { ApplicationRef } from "./refs";

@Module({
    providers: [
        ApplicationRef,
        ApplicationInitializer
    ]
})
export class ApplicationModule {}