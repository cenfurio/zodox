import { Provider } from "./di";
import { createPlatform, PlatformRef } from "./refs";
import { MetadataResolver, ModuleResolver, META_RESOLVERS } from "./resolvers";
import { Module, Injectable } from "./annotations";

const CORE_PLATFORM_PROVIDERS: Provider[] = [
    PlatformRef,
    MetadataResolver,
    {
        provide: META_RESOLVERS,
        useClass: ModuleResolver,
        multi: true
    }
];

export const CorePlatform = createPlatform(null, CORE_PLATFORM_PROVIDERS);

@Injectable()
class LoginService {

}

@Injectable()
class UserService {

}

@Module({
    providers: [LoginService]
})
class AuthModule {}

@Module({
    providers: [UserService],
    imports: [AuthModule]
})
class AppModule {}

CorePlatform().loadModule(AppModule);