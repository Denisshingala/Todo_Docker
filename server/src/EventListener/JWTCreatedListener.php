<?php

namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Security\Core\User\UserInterface;

final class JWTCreatedListener
{
    #[AsEventListener(event: 'lexik_jwt_authentication.on_jwt_created')]
    public function onLexikJwtAuthenticationOnJwtCreated(JWTCreatedEvent $event): void
    {
        // get the user to generate the JWT token
        /** @var User */
        $user = $event->getUser();

        if(!$user instanceof UserInterface) {
            return;
        }

        // get the current payload
        $payload = $event->getData();

        $payload['userIdentifier'] = $user->getUserIdentifier();

        // update the jwt payload
        $event->setData($payload);
    }
}
