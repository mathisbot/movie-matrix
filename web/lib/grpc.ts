'server-only'

import { GetUserRequest, GetUserResponse, UserServiceClient } from "@/services/user"
import { MovieServiceClient, GetMovieRequest } from "@/services/movie"
import { credentials, Metadata } from "@grpc/grpc-js"

import { promisify } from "util";

const userService = new UserServiceClient("localhost:4000", credentials.createInsecure());
export const userSignUp = promisify(userService.signUp.bind(userService))
export const userLogIn = promisify(userService.login.bind(userService))
export const getUser = promisify(userService.getUser.bind(userService)) as (request: GetUserRequest) => Promise<GetUserResponse>;

const movieService = new MovieServiceClient("localhost:4000", credentials.createInsecure());
export const getMovie = (token: string, data: any) => (
    new Promise((resolve, reject) => {
        const metadata = new Metadata();
        metadata.set("authorization", `Bearer ${token}`);
        const call = movieService.getMovie(data, metadata, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(res);
        })
    })
);
export const getMovies = (token: string, data: any) => (
    new Promise((resolve, reject) => {
        const metadata = new Metadata();
        metadata.set("authorization", `Bearer ${token}`);
        const call = movieService.getMovies(data, metadata, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(res);
        })
    })
);
export const searchMovies = (token: string, data: any) => (
    new Promise((resolve, reject) => {
        const metadata = new Metadata();
        metadata.set("authorization", `Bearer ${token}`);
        const call = movieService.searchMovie(data, metadata, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(res);
        })
    })
);
