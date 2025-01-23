<?php

namespace App\Controller;

use App\Entity\Tasks;
use App\Repository\TasksRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route("/api")]
class UserController extends AbstractController
{
    public function __construct(
        protected LoggerInterface $loggerInterface,
        protected HttpClientInterface $httpClient,
        protected EntityManagerInterface $entityManager,
        protected SerializerInterface $serializer
    ) {}

    #[Route("/get-details", name: "app_get_user_details", methods: "GET")]
    public function getUserDetails(Security $security): Response
    {
        $user = $security->getUser();

        if (null == $user) {
            return $this->json(["message" => "Unauthorized user or invalid request!", "status" => JsonResponse::HTTP_UNAUTHORIZED]);
        }

        return $this->json(["message" => "User details", "user" => json_decode($this->serializer->serialize($user, "json", ["groups" => "main_details"])), "status" => JsonResponse::HTTP_OK]);
    }

    #[Route("/get-todo-list", name: "app_todo_list", methods: "GET")]
    public function getTODOList(Security $security, TasksRepository $tasks): Response
    {
        $user = $security->getUser();

        if (null == $user) {
            return $this->json(["message" => "Unauthorized user or invalid request!", "status" => JsonResponse::HTTP_UNAUTHORIZED]);
        }

        $data = $tasks->getUserTasks($user);

        return $this->json(["message" => "Task list", "tasks" => json_decode($this->serializer->serialize($data, "json", ["groups" => "main_details"])), "status" => JsonResponse::HTTP_OK]);
    }

    #[Route("/add-todo", name: "app_add_todo", methods: "POST")]
    public function addTODOList(Security $security, Request $request): Response
    {
        $user = $security->getUser();

        if (null == $user) {
            return $this->json(["message" => "Unauthorized user or invalid request!", "status" => JsonResponse::HTTP_UNAUTHORIZED]);
        }

        $data = json_decode($request->getContent(), true);

        $task = new Tasks();
        $task->setTitle($data['title']);
        $task->setDescription($data['desc']);
        $task->setUser($user);

        $this->entityManager->persist($task);
        $this->entityManager->flush();

        return $this->json(["message" => "Task list", "task" => $this->serializer->serialize($task, "json", ["groups" => "main_details"]), "status" => JsonResponse::HTTP_OK]);
    }

    #[Route("/change-status/{id}", name: "app_change_status", methods: "POST")]
    public function completeTODOList(Tasks $task, Security $security): Response
    {
        $user = $security->getUser();

        if (null === $user || $user !== $task->getUser()) {
            return $this->json(["message" => "Unauthorized user or invalid request!", "status" => JsonResponse::HTTP_UNAUTHORIZED]);
        }

        $task->setStatus($task->getStatus() === 1 ? -1 : 1);

        $this->entityManager->flush();

        return $this->json(["message" => "Task Completed!", "task" => $this->serializer->serialize($task, "json", ["groups" => "main_details"]), "status" => JsonResponse::HTTP_OK]);
    }

    #[Route("/remove-todo/{id}", name: "app_remove_todo", methods: "POST")]
    public function removeTODOList(Tasks $task, Security $security): Response
    {
        $user = $security->getUser();

        if (null === $user || $user !== $task->getUser()) {
            return $this->json(["message" => "Unauthorized user or invalid request!", "status" => JsonResponse::HTTP_UNAUTHORIZED]);
        }

        $task->setStatus("0");

        $this->entityManager->flush();

        return $this->json(["message" => "Task removed!", "task" => $this->serializer->serialize($task, "json", ["groups" => "main_details"]), "status" => JsonResponse::HTTP_OK]);
    }
}
