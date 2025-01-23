<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route("/api")]
class LoginRegisterController extends AbstractController
{
    public function __construct(
        protected LoggerInterface $loggerInterface,
        protected JWTTokenManagerInterface $JWTTokenManager,
        protected UserPasswordHasherInterface $userpasswordHasher,
        protected EntityManagerInterface $entityManager,
        protected HttpClientInterface $httpClient
    ) {}

    #[Route("/register", name: "app_register_api", methods: "POST")]
    public function register(Request $request): Response
    {
        try {
            $data = json_decode($request->getContent(), true);

            // create new User 
            $user = new User();
            $user->setUsername($data['username']);
            $user->setEmail($data['email']);
            $user->setPassword($this->userpasswordHasher->hashPassword($user, $data['password']));

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            return $this->json(["status" => "success", "message" => "New use has been craeted!"]);
        } catch (Exception $err) {
            $this->loggerInterface->info(sprintf("Critical Note: %s on %s at line %d", $err->getMessage(), $err->getFile(), $err->getLine()));
            return $this->json(["status" => "error", "message" => $err->getMessage()]);
        }
    }

    #[Route("/auth", name: "app_auth_api", methods: "GET")]
    public function auth(Security $security): Response
    {
        /** @var User */
        $user = $security->getUser();

        if (null === $user) {
            return $this->json(["message" => "Invalid user or request!", "status" => JsonResponse::HTTP_UNAUTHORIZED]);
        }

        return $this->json(["message" => "User verify!", "status" => JsonResponse::HTTP_OK]);
    }
}
