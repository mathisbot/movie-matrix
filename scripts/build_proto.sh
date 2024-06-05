#!/bin/bash
protoc --plugin=$(pnpm root)/.bin/protoc-gen-ts_proto \
 --ts_proto_out=web/services \
 --ts_proto_opt=outputServices=nice-grpc,outputServices=generic-definitions,useExactTypes=false \
 -I=proto/ proto/*.proto