<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\StudentClass
 *
 * @property int $id
 * @property string $name
 * @property string|null $grade
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Student> $students
 * @property-read int|null $students_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $teachers
 * @property-read int|null $teachers_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|StudentClass newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentClass newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentClass query()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentClass whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentClass whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentClass whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentClass whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentClass whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentClass whereUpdatedAt($value)
 * @method static \Database\Factories\StudentClassFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class StudentClass extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'classes';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'grade',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the students in this class.
     */
    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    /**
     * Get the teachers assigned to this class.
     */
    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'teacher_classes', 'class_id', 'user_id');
    }
}