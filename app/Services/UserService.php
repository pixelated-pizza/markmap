<?php

namespace App\Services;

use Illuminate\Support\Collection;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Attempt to login a user.
     *
     * @param string $email
     * @param string $password
     * @return User|null
     */
    public function login(string $email, string $password, bool $remember = false): ?User
    {
        if (Auth::attempt(['email' => $email, 'password' => $password], $remember)) {
            return Auth::user();
        }

        return null;
    }

    public function logout(): void
    {
        $user = Auth::user();

        if ($user) {
            // Delete token if exists (for API/SPAs)
            if (method_exists($user, 'currentAccessToken') && $user->currentAccessToken()) {
                $user->currentAccessToken()->delete();
            }

            Auth::logout();
        }
    }
    public function all(): Collection
    {
        return User::get();
    }

    public function find(int $id): ?User
    {
        return User::find($id);
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(int $id, array $data): ?User
    {
        $user = User::find($id);
        if (!$user) {
            return null;
        }

        $user->update($data);
        return $user;
    }

    public function delete(int $id): bool
    {
        $user = User::find($id);
        if (!$user) {
            return false;
        }

        return (bool) $user->delete();
    }

    public function current(): ?User
    {
        return Auth::user();
    }

    /**
     * Get only the authenticated user's name.
     *
     * @return string|null
     */
    public function currentName(): ?string
    {
        return Auth::check() ? Auth::user()->name : null;
    }
}
