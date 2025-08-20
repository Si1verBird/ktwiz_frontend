package com.kt.backendapp.entity;

import com.kt.backendapp.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(name = "unit_price", nullable = false)
    private Integer unitPrice = 0;

    @Column(nullable = false)
    private Integer amount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.pending;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "pg_provider")
    private String pgProvider;

    @Column(name = "pg_tx_id")
    private String pgTxId;

    @Column(name = "pg_payload", columnDefinition = "TEXT")
    private String pgPayload;

    @Column(name = "receipt_url")
    private String receiptUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
