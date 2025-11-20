<?php

/**
 * @phpstan-type Step array{fn: callable, arg: mixed}
 * @phpstan-type Result array{success: bool, data?: array<string, mixed>, error?: string}
 */
class MonadicChain
{
    /**
     * @param Step[] $steps
     * @param array<string, mixed> $initialData
     * @return Result
     */
    public static function execute(array $steps, array $initialData): array
    {
        $data = $initialData;

        foreach ($steps as $step) {
            try {
                $data = $step['fn']($data, $step['arg']);
            } catch (Exception $e) {
                return ['success' => false, 'error' => $e->getMessage()];
            }
        }

        return ['success' => true, 'data' => $data];
    }
}

// Определение функций
/**
 * @param array<string, mixed> $data
 * @param mixed $arg
 * @return array<string, mixed>
 */
$f1 = function(array $data, $arg): array {
    $length = is_string($arg) ? strlen($arg) : 0;
    return array_merge($data, [
        'f1' => $arg,
        'f1Length' => $length,
    ]);
};

/**
 * @param array<string, mixed> $data
 * @param mixed $arg
 * @return array<string, mixed>
 */
$f2 = function(array $data, $arg): array {
    $upper = is_string($arg) ? strtoupper($arg) : $arg;
    return array_merge($data, [
        'f2' => $arg,
        'f2Upper' => $upper,
    ]);
};

/**
 * @param array<string, mixed> $data
 * @param mixed $arg
 * @return array<string, mixed>
 */
$f3 = function(array $data, $arg): array {
    return array_merge($data, ['f3' => $arg]);
};

// Использование
$result = MonadicChain::execute(
    [
        ['fn' => $f1, 'arg' => 'hello'],
        ['fn' => $f2, 'arg' => 'world'],
        ['fn' => $f3, 'arg' => '!'],
    ],
    []
);

print_r($result);