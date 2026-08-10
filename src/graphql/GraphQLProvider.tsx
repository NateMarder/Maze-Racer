"use client";

import { ApolloProvider } from "@apollo/client/react";
import type { ReactNode } from "react";
import { graphqlClient } from "./client";

type GraphQLProviderProps = {
  children: ReactNode;
};

export function GraphQLProvider({ children }: GraphQLProviderProps) {
  return (
    <ApolloProvider client={graphqlClient}>
      {children}
    </ApolloProvider>
  );
}
