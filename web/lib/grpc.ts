'server-only'

import { GetUserRequest, GetUserResponse, UserServiceClient } from "@/services/user"
import { credentials } from "@grpc/grpc-js"

import { promisify } from "util";

const userService = new UserServiceClient("localhost:4000", credentials.createInsecure());
export const userSignUp = promisify(userService.signUp.bind(userService))
export const userLogIn = promisify(userService.login.bind(userService))
export const getUser = promisify(userService.getUser.bind(userService)) as (request: GetUserRequest) => Promise<GetUserResponse>;
