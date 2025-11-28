package com.chatapp.repository;

import com.chatapp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    @Query("{ 'username': { $regex: ?0, $options: 'i' } }")
    List<User> findByUsernameContainingIgnoreCase(String username);

    List<User> findByStatus(String status);

    @Query("{ 'contacts': ?0 }")
    List<User> findUsersByContact(String userId);
}