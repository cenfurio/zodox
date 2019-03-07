import { Server } from "../common";

import Koa from 'koa';

export class KoaServer extends Server {
    private app = new Koa();

    use(middleware: any): boolean {
        this.app.use(middleware);
        return true;
    }
    
    listen(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.app.listen({
                port: this.config.port,
                host: this.config.host
            }, () => resolve());
        });
    }


}