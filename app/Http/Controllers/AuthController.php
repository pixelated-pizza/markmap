<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function login(LoginUserRequest $request): JsonResponse
    {
        $user = $this->userService->login(
            $request->email,
            $request->password,
            $request->boolean('remember')
        );

        if (!$user) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    public function logout(UserService $userService)
    {
        $userService->logout();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function getUser(UserService $userService)
    {
        $user = $userService->current();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role_id' => $user->role_id
        ]);
    }
}
