import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    icon?: string;
    hidden?: boolean;
    uuid?: string;
  }
}
