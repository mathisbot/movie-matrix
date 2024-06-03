// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.176.1
//   protoc               v5.26.1
// source: user.proto

/* eslint-disable */
import {
  type CallOptions,
  ChannelCredentials,
  Client,
  type ClientOptions,
  type ClientUnaryCall,
  type handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  type ServiceError,
  type UntypedServiceImplementation,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "user";

export interface SignUpRequest {
  username: string;
  password: string;
}

export interface SignUpResponse {
  sessionToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  sessionToken: string;
}

export interface LogoutRequest {
  sessionToken: string;
}

export interface LogoutResponse {}

export interface CheckSessionRequest {
  sessionToken: string;
}

export interface CheckSessionResponse {
  success: boolean;
  message: string;
  username: string;
}

function createBaseSignUpRequest(): SignUpRequest {
  return { username: "", password: "" };
}

export const SignUpRequest = {
  encode(
    message: SignUpRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignUpRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignUpRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SignUpRequest {
    return {
      username: isSet(object.username)
        ? globalThis.String(object.username)
        : "",
      password: isSet(object.password)
        ? globalThis.String(object.password)
        : "",
    };
  },

  toJSON(message: SignUpRequest): unknown {
    const obj: any = {};
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SignUpRequest>, I>>(
    base?: I
  ): SignUpRequest {
    return SignUpRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SignUpRequest>, I>>(
    object: I
  ): SignUpRequest {
    const message = createBaseSignUpRequest();
    message.username = object.username ?? "";
    message.password = object.password ?? "";
    return message;
  },
};

function createBaseSignUpResponse(): SignUpResponse {
  return { sessionToken: "" };
}

export const SignUpResponse = {
  encode(
    message: SignUpResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sessionToken !== "") {
      writer.uint32(10).string(message.sessionToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignUpResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignUpResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sessionToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SignUpResponse {
    return {
      sessionToken: isSet(object.sessionToken)
        ? globalThis.String(object.sessionToken)
        : "",
    };
  },

  toJSON(message: SignUpResponse): unknown {
    const obj: any = {};
    if (message.sessionToken !== "") {
      obj.sessionToken = message.sessionToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SignUpResponse>, I>>(
    base?: I
  ): SignUpResponse {
    return SignUpResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SignUpResponse>, I>>(
    object: I
  ): SignUpResponse {
    const message = createBaseSignUpResponse();
    message.sessionToken = object.sessionToken ?? "";
    return message;
  },
};

function createBaseLoginRequest(): LoginRequest {
  return { username: "", password: "" };
}

export const LoginRequest = {
  encode(
    message: LoginRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LoginRequest {
    return {
      username: isSet(object.username)
        ? globalThis.String(object.username)
        : "",
      password: isSet(object.password)
        ? globalThis.String(object.password)
        : "",
    };
  },

  toJSON(message: LoginRequest): unknown {
    const obj: any = {};
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LoginRequest>, I>>(
    base?: I
  ): LoginRequest {
    return LoginRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LoginRequest>, I>>(
    object: I
  ): LoginRequest {
    const message = createBaseLoginRequest();
    message.username = object.username ?? "";
    message.password = object.password ?? "";
    return message;
  },
};

function createBaseLoginResponse(): LoginResponse {
  return { sessionToken: "" };
}

export const LoginResponse = {
  encode(
    message: LoginResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sessionToken !== "") {
      writer.uint32(10).string(message.sessionToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sessionToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LoginResponse {
    return {
      sessionToken: isSet(object.sessionToken)
        ? globalThis.String(object.sessionToken)
        : "",
    };
  },

  toJSON(message: LoginResponse): unknown {
    const obj: any = {};
    if (message.sessionToken !== "") {
      obj.sessionToken = message.sessionToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LoginResponse>, I>>(
    base?: I
  ): LoginResponse {
    return LoginResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LoginResponse>, I>>(
    object: I
  ): LoginResponse {
    const message = createBaseLoginResponse();
    message.sessionToken = object.sessionToken ?? "";
    return message;
  },
};

function createBaseLogoutRequest(): LogoutRequest {
  return { sessionToken: "" };
}

export const LogoutRequest = {
  encode(
    message: LogoutRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sessionToken !== "") {
      writer.uint32(10).string(message.sessionToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogoutRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogoutRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sessionToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LogoutRequest {
    return {
      sessionToken: isSet(object.sessionToken)
        ? globalThis.String(object.sessionToken)
        : "",
    };
  },

  toJSON(message: LogoutRequest): unknown {
    const obj: any = {};
    if (message.sessionToken !== "") {
      obj.sessionToken = message.sessionToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LogoutRequest>, I>>(
    base?: I
  ): LogoutRequest {
    return LogoutRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LogoutRequest>, I>>(
    object: I
  ): LogoutRequest {
    const message = createBaseLogoutRequest();
    message.sessionToken = object.sessionToken ?? "";
    return message;
  },
};

function createBaseLogoutResponse(): LogoutResponse {
  return {};
}

export const LogoutResponse = {
  encode(
    _: LogoutResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogoutResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogoutResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): LogoutResponse {
    return {};
  },

  toJSON(_: LogoutResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<LogoutResponse>, I>>(
    base?: I
  ): LogoutResponse {
    return LogoutResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LogoutResponse>, I>>(
    _: I
  ): LogoutResponse {
    const message = createBaseLogoutResponse();
    return message;
  },
};

function createBaseCheckSessionRequest(): CheckSessionRequest {
  return { sessionToken: "" };
}

export const CheckSessionRequest = {
  encode(
    message: CheckSessionRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sessionToken !== "") {
      writer.uint32(10).string(message.sessionToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckSessionRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckSessionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sessionToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CheckSessionRequest {
    return {
      sessionToken: isSet(object.sessionToken)
        ? globalThis.String(object.sessionToken)
        : "",
    };
  },

  toJSON(message: CheckSessionRequest): unknown {
    const obj: any = {};
    if (message.sessionToken !== "") {
      obj.sessionToken = message.sessionToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckSessionRequest>, I>>(
    base?: I
  ): CheckSessionRequest {
    return CheckSessionRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CheckSessionRequest>, I>>(
    object: I
  ): CheckSessionRequest {
    const message = createBaseCheckSessionRequest();
    message.sessionToken = object.sessionToken ?? "";
    return message;
  },
};

function createBaseCheckSessionResponse(): CheckSessionResponse {
  return { success: false, message: "", username: "" };
}

export const CheckSessionResponse = {
  encode(
    message: CheckSessionResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.success !== false) {
      writer.uint32(8).bool(message.success);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    if (message.username !== "") {
      writer.uint32(26).string(message.username);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CheckSessionResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckSessionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.success = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.username = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CheckSessionResponse {
    return {
      success: isSet(object.success)
        ? globalThis.Boolean(object.success)
        : false,
      message: isSet(object.message) ? globalThis.String(object.message) : "",
      username: isSet(object.username)
        ? globalThis.String(object.username)
        : "",
    };
  },

  toJSON(message: CheckSessionResponse): unknown {
    const obj: any = {};
    if (message.success !== false) {
      obj.success = message.success;
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    if (message.username !== "") {
      obj.username = message.username;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckSessionResponse>, I>>(
    base?: I
  ): CheckSessionResponse {
    return CheckSessionResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CheckSessionResponse>, I>>(
    object: I
  ): CheckSessionResponse {
    const message = createBaseCheckSessionResponse();
    message.success = object.success ?? false;
    message.message = object.message ?? "";
    message.username = object.username ?? "";
    return message;
  },
};

export type UserServiceService = typeof UserServiceService;
export const UserServiceService = {
  signUp: {
    path: "/user.UserService/SignUp",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: SignUpRequest) =>
      Buffer.from(SignUpRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SignUpRequest.decode(value),
    responseSerialize: (value: SignUpResponse) =>
      Buffer.from(SignUpResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => SignUpResponse.decode(value),
  },
  login: {
    path: "/user.UserService/Login",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: LoginRequest) =>
      Buffer.from(LoginRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => LoginRequest.decode(value),
    responseSerialize: (value: LoginResponse) =>
      Buffer.from(LoginResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => LoginResponse.decode(value),
  },
  logout: {
    path: "/user.UserService/Logout",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: LogoutRequest) =>
      Buffer.from(LogoutRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => LogoutRequest.decode(value),
    responseSerialize: (value: LogoutResponse) =>
      Buffer.from(LogoutResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => LogoutResponse.decode(value),
  },
  checkSession: {
    path: "/user.UserService/CheckSession",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CheckSessionRequest) =>
      Buffer.from(CheckSessionRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CheckSessionRequest.decode(value),
    responseSerialize: (value: CheckSessionResponse) =>
      Buffer.from(CheckSessionResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CheckSessionResponse.decode(value),
  },
} as const;

export interface UserServiceServer extends UntypedServiceImplementation {
  signUp: handleUnaryCall<SignUpRequest, SignUpResponse>;
  login: handleUnaryCall<LoginRequest, LoginResponse>;
  logout: handleUnaryCall<LogoutRequest, LogoutResponse>;
  checkSession: handleUnaryCall<CheckSessionRequest, CheckSessionResponse>;
}

export interface UserServiceClient extends Client {
  signUp(
    request: SignUpRequest,
    callback: (error: ServiceError | null, response: SignUpResponse) => void
  ): ClientUnaryCall;
  signUp(
    request: SignUpRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: SignUpResponse) => void
  ): ClientUnaryCall;
  signUp(
    request: SignUpRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: SignUpResponse) => void
  ): ClientUnaryCall;
  login(
    request: LoginRequest,
    callback: (error: ServiceError | null, response: LoginResponse) => void
  ): ClientUnaryCall;
  login(
    request: LoginRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: LoginResponse) => void
  ): ClientUnaryCall;
  login(
    request: LoginRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: LoginResponse) => void
  ): ClientUnaryCall;
  logout(
    request: LogoutRequest,
    callback: (error: ServiceError | null, response: LogoutResponse) => void
  ): ClientUnaryCall;
  logout(
    request: LogoutRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: LogoutResponse) => void
  ): ClientUnaryCall;
  logout(
    request: LogoutRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: LogoutResponse) => void
  ): ClientUnaryCall;
  checkSession(
    request: CheckSessionRequest,
    callback: (
      error: ServiceError | null,
      response: CheckSessionResponse
    ) => void
  ): ClientUnaryCall;
  checkSession(
    request: CheckSessionRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CheckSessionResponse
    ) => void
  ): ClientUnaryCall;
  checkSession(
    request: CheckSessionRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CheckSessionResponse
    ) => void
  ): ClientUnaryCall;
}

export const UserServiceClient = makeGenericClientConstructor(
  UserServiceService,
  "user.UserService"
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>
  ): UserServiceClient;
  service: typeof UserServiceService;
  serviceName: string;
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends globalThis.Array<infer U>
  ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}