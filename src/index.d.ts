import { JAS } from "@prisma/client";
declare module "@tanstack/table-core" {
  interface FilterFns {
    testFilter: FilterFn<JAS>;
  }
}
