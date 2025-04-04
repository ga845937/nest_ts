import type { ApiPropertyOptions } from "@nestjs/swagger";

export const agentApiPropertyOption: ApiPropertyOptions = {
    description: "代理編號",
    example    : 1,
};

export const accountApiPropertyOption: ApiPropertyOptions = {
    description: "帳號",
    example    : "account",
};

export const passwordApiPropertyOption: ApiPropertyOptions = {
    description: "密碼 (base64編碼)",
    example    : "cGFzc3dvcmQ=",
};

export const statusApiPropertyOption: ApiPropertyOptions = {
    description: "狀態 0-停用 1-啟用",
    example    : 0,
};

export const pkIDApiPropertyOption: ApiPropertyOptions = {
    description: "主鍵編號",
    example    : 1,
};

export const pkStringIDApiPropertyOption: ApiPropertyOptions = {
    description: "主鍵編號(字串)",
    example    : "550e8400-e29b-41d4-a716-446655440000",
};
