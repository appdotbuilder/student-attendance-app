<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['present', 'permission', 'sick', 'late', 'absent'];
        $weights = [70, 10, 8, 7, 5]; // Higher probability for 'present'
        
        return [
            'student_id' => Student::factory(),
            'date' => fake()->dateTimeBetween('-30 days', 'today')->format('Y-m-d'),
            'status' => fake()->randomElement($statuses),
            'notes' => fake()->optional(0.3)->sentence(),
            'marked_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the student is present.
     */
    public function present(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'present',
            'notes' => null,
        ]);
    }

    /**
     * Indicate that the student is absent.
     */
    public function absent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'absent',
            'notes' => fake()->optional(0.5)->sentence(),
        ]);
    }

    /**
     * Indicate that the student is sick.
     */
    public function sick(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sick',
            'notes' => fake()->optional(0.7)->sentence(),
        ]);
    }
}