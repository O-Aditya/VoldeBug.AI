import type { Request, Response } from "express";
import { registerUser, loginUser, setUserRole, getUserById, createUserFromProvider } from "./auth.service.js";
import { apiSuccess, apiError } from "../../utils/api.js";
import { generateToken } from "../../utils/jwt.js";
import { logger } from "../../middleware/requestLogger.js";

export async function handleRegister(req: Request, res: Response) {
  try {
    const user = await registerUser(req.body);
    return apiSuccess(res, user, 201);
  } catch (err) {
    return apiError(res, {
      code: "REGISTER_FAILED",
      message: (err as Error).message,
      status: 400,
    });
  }
}

export async function handleLogin(req: Request, res: Response) {
  try {
    const user = await loginUser(req.body);
    if (!user) {
      return apiError(res, {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
        status: 401,
      });
    }
    return apiSuccess(res, user);
  } catch (err) {
    return apiError(res, {
      code: "LOGIN_FAILED",
      message: (err as Error).message,
      status: 500,
    });
  }
}

export async function handleSetRole(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return apiError(res, {
        code: "UNAUTHORIZED",
        message: "Authentication required",
        status: 401,
      });
    }
    const user = await setUserRole(userId, req.body.role);
    return apiSuccess(res, user);
  } catch (err) {
    return apiError(res, {
      code: "ROLE_FAILED",
      message: (err as Error).message,
      status: 400,
    });
  }
}

export async function handleMe(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    return apiError(res, {
      code: "UNAUTHORIZED",
      message: "Authentication required",
      status: 401,
    });
  }
  try {
    const user = await getUserById(userId);
    if (!user) {
      return apiError(res, {
        code: "USER_NOT_FOUND",
        message: "User not found",
        status: 404,
      });
    }
    return apiSuccess(res, user);
  } catch (err) {
    return apiError(res, {
      code: "FETCH_USER_FAILED",
      message: (err as Error).message,
      status: 500,
    });
  }
}

export async function handleProviderLogin(req: Request, res: Response) {
  const { email, name, image } = req.body;
  if (!email) {
    return apiError(res, {
      code: "INVALID_INPUT",
      message: "Email is required",
      status: 400,
    });
  }
  try {
    const user = await createUserFromProvider(email, name ?? "", image);

    // Generate a JWT so the client can authenticate subsequent API calls
    // (e.g., role assignment, onboarding) without a separate login step.
    const token = generateToken({
      id: user.id,
      email: user.email ?? email,
      role: user.role,
    });

    return apiSuccess(res, { ...user, token });
  } catch (err) {
    logger.error(`Provider login error: ${err}`);
    return apiError(res, {
      code: "PROVIDER_LOGIN_FAILED",
      message: "Could not create or find user",
      status: 500,
    });
  }
}
