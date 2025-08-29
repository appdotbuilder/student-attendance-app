<?php

namespace Database\Factories;

use App\Models\StudentClass;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'student_id' => 'STU' . fake()->unique()->numberBetween(1000, 9999),
            'class_id' => StudentClass::factory(),
            'date_of_birth' => fake()->dateTimeBetween('-18 years', '-5 years')->format('Y-m-d'),
            'email' => fake()->optional(0.7)->safeEmail(),
            'phone' => fake()->optional(0.8)->phoneNumber(),
            'address' => fake()->optional(0.9)->address(),
        ];
    }
}