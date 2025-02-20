module github.com/devXpranay/huddler/apps/spawner-service

go 1.23.2

require github.com/devXpranay/huddler/lib/common v0.0.0-00010101000000-000000000000

require (
	github.com/cespare/xxhash/v2 v2.3.0 // indirect
	github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/redis/go-redis/v9 v9.7.0 // indirect
)

replace github.com/devXpranay/huddler/lib/common => ..\..\libs\common
