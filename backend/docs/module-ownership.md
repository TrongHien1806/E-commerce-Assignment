# Module Ownership (2 members)

## Module tree

- `src/modules/auth`
- `src/modules/user`
- `src/modules/health`
- `src/modules/food`
- `src/modules/pt`
- `src/modules/cart`
- `src/modules/order`
- `src/modules/payment`
- `src/modules/tracking`
- `src/modules/chat-workout`
- `src/modules/notification`
- `src/modules/admin`
- `src/modules/review`

## Ownership table

| Module | Owner | Backup Reviewer | Notes |
|---|---|---|---|
| auth | Member B | Member A | Login/register/forgot/reset/token |
| user | Member B | Member A | Profile/settings/account info |
| health | Member B | Member A | Intake/BMR-TDEE/macro |
| food | Member A | Member B | Food catalog/detail/filter |
| pt | Member B | Member A | PT profile/directory/services |
| cart | Member A | Member B | Cart items/quantity/total |
| order | Member A | Member B | Checkout/order lifecycle |
| payment | Member A | Member B | VNPay/MoMo callback |
| tracking | Member B | Member A | Weight + daily calorie tracking |
| chat-workout | Member B | Member A | PT-client chat/workout assignment |
| notification | Member B | Member A | Bell + event notifications |
| admin | Member A | Member B | Admin panel, PT approval, operations |
| review | Member A | Member B | Verified review/rating |

## Merge rules to reduce conflicts

1. One module = one owner writes first; backup reviewer only reviews unless assigned.
2. Do not edit another member's module in the same PR unless pre-agreed.
3. Shared files (`src/index.ts`, shared constants, shared schemas) are changed in a dedicated `chore/integration-*` branch.
4. Merge small PRs (200-400 LOC), at least 2 integration windows/day.
5. Rebase from `develop` before opening PR.
6. If a shared contract changes (DTO/response/status), update Postman/Swagger in the same PR.

## Suggested branch naming

- `feature/member-a-food-catalog`
- `feature/member-a-checkout-payment`
- `feature/member-b-health-metrics`
- `feature/member-b-chat-workout`
- `chore/integration-routes`
- `chore/integration-shared-types`

## Definition of done (per module)

- API contract updated.
- Validation + error messages completed.
- At least one happy path and one error path tested.
- Build/lint pass locally.
- No unrelated shared-file changes.
