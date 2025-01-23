<?php

namespace App\Security;

use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class UserAuthenticator extends AbstractAuthenticator
{
    public function __construct(protected JWTTokenManagerInterface $JWTTokenManager, protected UserProviderInterface $userProvider) {}

    public function supports(Request $request): ?bool
    {
        // Check if the Authorization header is present and starts with "Bearer "
        return $request->headers->has('Authorization') && str_starts_with($request->headers->get('Authorization'), 'Bearer ');
    }

    public function authenticate(Request $request): Passport
    {
        try {
            // get the token from the header
            $authenticationToken = substr($request->headers->get("Authorization"), 7);

            if (null === $authenticationToken) {
                return new CustomUserMessageAuthenticationException("No token found!");
            }

            $tokenData = $this->JWTTokenManager->parse($authenticationToken);

            if (!$tokenData || !isset($tokenData['username'])) {
                return new CustomUserMessageAuthenticationException("Token is expired or invalid!");
            }

            // return a passport object with the token and user provider
            return new SelfValidatingPassport(new UserBadge($tokenData['userIdentifier']));
        } catch (Exception $err) {
            throw new AuthenticationException($err->getMessage());
        }
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse(["success" => 0, "message" => $exception->getMessage()], JsonResponse::HTTP_UNAUTHORIZED);
    }

    //    public function start(Request $request, AuthenticationException $authException = null): Response
    //    {
    //        /*
    //         * If you would like this class to control what happens when an anonymous user accesses a
    //         * protected page (e.g. redirect to /login), uncomment this method and make this class
    //         * implement Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface.
    //         *
    //         * For more details, see https://symfony.com/doc/current/security/experimental_authenticators.html#configuring-the-authentication-entry-point
    //         */
    //    }
}
