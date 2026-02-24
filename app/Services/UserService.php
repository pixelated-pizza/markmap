<?php

namespace App\Services;

use Illuminate\Support\Collection;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

use App\Services\FirebaseService;

class UserService
{
    /**
     * Attempt to login a user.
     *
     * @param string $email
     * @param string $password
     * @return User|null
     */

    protected FirebaseService $firebase;

    public function __construct(FirebaseService $firebase)
    {
        $this->firebase = $firebase;
    }

    /**
     * Login via Laravel password
     */
    public function login(string $email, string $password, bool $remember = false): ?User
    {
        if (Auth::attempt(['email' => $email, 'password' => $password], $remember)) {
            return Auth::user();
        }
        return null;
    }

    /**
     * Login via Firebase token
     */
    public function loginWithFirebase(string $idToken): ?User
    {
        $payload = $this->firebase->verifyIdToken($idToken);

        if (!$payload) {
            return null; // Invalid token
        }

        $defaultRoleId = DB::table('roles')->where('role_name', 'Editor')->value('role_id');

        // Find or create Laravel user by firebase_uid
        $user = User::firstOrCreate(
            ['firebase_uid' => $payload['uid']],
            [
                'email' => $payload['email'] ?? null,
                'name' => $payload['name'] ?? 'Unknown',
                'password' => bcrypt(bin2hex(random_bytes(16))),
                'role_id' => $defaultRoleId,
            ]
        );

        // If you want to link existing email to firebase_uid
        if ($user->firebase_uid === null) {
            $user->firebase_uid = $payload['uid'];
            $user->save();
        }

        Auth::login($user);

        return $user;
    }

    public function logout(): void
    {
        $user = Auth::user();

        if ($user) {
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
