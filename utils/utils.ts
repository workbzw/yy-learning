import {redirect} from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
    type: "error" | "success",
    path: string,
    message: string,
) {
    return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export class StringGenerator {
    private static readonly CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

    /**
     * 生成指定长度的随机字符串
     * @param length 字符串长度，默认为16
     * @returns 随机字符串
     */
    static generateRandomString(length: number = 16): string {
        let result = '';
        const charsLength = this.CHARS.length;

        for (let i = 0; i < length; i++) {
            result += this.CHARS.charAt(Math.floor(Math.random() * charsLength));
        }

        return result;
    }

    /**
     * 生成带前缀的随机字符串
     * @param prefix 前缀字符串
     * @param length 随机部分长度，默认为10
     * @returns 带前缀的随机字符串
     */
    static generateWithPrefix(prefix: string, length: number = 10): string {
        return prefix + this.generateRandomString(length);
    }


}

export function generateToken(): string {
    return StringGenerator.generateRandomString()
}/**
 * 生成1000-9999之间的随机四位数
 */
export function generateCode(): string {
    // 生成1000到9999之间的随机整数
    const randomNum = Math.floor(Math.random() * 9000) + 999;
    return randomNum.toString();
}

export function  parseCookies(cookieHeader: string | null): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name) cookies[name] = value || '';
    });

    return cookies;
}

export function getCookies(req:Request){
    const cookieHeader = req.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
}

