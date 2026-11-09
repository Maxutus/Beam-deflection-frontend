/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsBeamResponse {
  created_at?: string;
  creator?: string;
  deflection?: number;
  description?: string;
  formed_at?: string;
  id?: number;
  image_url?: string;
  is_liked?: number;
  is_mine?: number;
  like_count?: number;
  load?: number;
  name?: string;
  video_url?: string;
}

export interface DsLikeRequest {
  like: number;
}

export interface DsLoginResponse {
  access_token?: string;
  expires_in?: number;
  is_moderator?: boolean;
  login?: string;
  token_type?: string;
}

export interface DsPublishRequest {
  deflection?: number;
  description?: string;
  load?: number;
}

export interface DsUserCredentialsRequest {
  login: string;
  password: string;
}

export interface DsUserResponse {
  id?: number;
  is_moderator?: boolean;
  login?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8080/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Расчёт прогиба балки
 * @version 1.0
 * @baseUrl http://localhost:8080/api
 * @contact
 *
 * Веб-сервис типов балок: список, лента, черновик, публикация, удаление, лайки и пользователи.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  beams = {
    /**
     * @description Только опубликованные балки, фильтр по максимальному прогибу. Признак is_mine – 1, если создатель совпадает с текущим пользователем
     *
     * @tags Балки
     * @name BeamsList
     * @summary Список опубликованных балок
     * @request GET:/beams
     * @secure
     */
    beamsList: (
      query?: {
        /** Максимальный прогиб, мм */
        max_deflection?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsBeamResponse[], void>({
        path: `/beams`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт черновик текущего пользователя, фото и видео загружаются в MinIO
     *
     * @tags Балки
     * @name BeamsCreate
     * @summary Добавление балки
     * @request POST:/beams
     * @secure
     */
    beamsCreate: (
      data: {
        /** Название */
        name: string;
        /**
         * Фото
         * @format binary
         */
        image: File;
        /**
         * Видео
         * @format binary
         */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsBeamResponse, void>({
        path: `/beams`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description id не указывается, у пользователя не более одного черновика
     *
     * @tags Балки
     * @name DraftList
     * @summary Черновик текущего пользователя
     * @request GET:/beams/draft
     * @secure
     */
    draftList: (params: RequestParams = {}) =>
      this.request<DsBeamResponse, void>({
        path: `/beams/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Заполняет описание, нагрузку и прогиб и меняет статус на «опубликован»
     *
     * @tags Балки
     * @name DraftPublishUpdate
     * @summary Публикация черновика
     * @request PUT:/beams/draft/publish
     * @secure
     */
    draftPublishUpdate: (
      request: DsPublishRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsBeamResponse, void>({
        path: `/beams/draft/publish`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Одна опубликованная балка: без параметров – первая, id – эта балка, id и next=true – следующая после неё. Признак is_liked – 1, если текущий пользователь лайкнул балку
     *
     * @tags Балки
     * @name FeedList
     * @summary Лента
     * @request GET:/beams/feed
     * @secure
     */
    feedList: (
      query?: {
        /** id балки */
        id?: number;
        /** Следующая после id */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsBeamResponse, void>({
        path: `/beams/feed`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Мягкое удаление (статус «удалён»), только балки текущего пользователя
     *
     * @tags Балки
     * @name BeamsDelete
     * @summary Удаление балки
     * @request DELETE:/beams/{id}
     * @secure
     */
    beamsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/beams/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Лайк от текущего пользователя: like = 1 ставит, like = 0 отменяет
     *
     * @tags Балки
     * @name LikeCreate
     * @summary Лайк
     * @request POST:/beams/{id}/like
     * @secure
     */
    likeCreate: (
      id: number,
      request: DsLikeRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsBeamResponse, void>({
        path: `/beams/${id}/like`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Возвращает JWT для заголовка Authorization: Bearer <токен>
     *
     * @tags Пользователи
     * @name LoginCreate
     * @summary Аутентификация
     * @request POST:/users/login
     */
    loginCreate: (
      request: DsUserCredentialsRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsLoginResponse, void>({
        path: `/users/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет токен в blacklist Redis
     *
     * @tags Пользователи
     * @name LogoutCreate
     * @summary Деавторизация
     * @request POST:/users/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Пользователи
     * @name RegisterCreate
     * @summary Регистрация
     * @request POST:/users/register
     */
    registerCreate: (
      request: DsUserCredentialsRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsUserResponse, void>({
        path: `/users/register`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
