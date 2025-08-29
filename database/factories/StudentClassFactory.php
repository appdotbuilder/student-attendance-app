<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentClass>
 */
class StudentClassFactory extends Factory
{


    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $grades = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade'];
        $subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art'];

        return [
            'name' => fake()->randomElement($subjects) . ' - ' . fake()->randomElement($grades),
            'grade' => fake()->randomElement($grades),
            'description' => fake()->sentence(),
        ];
    }
}